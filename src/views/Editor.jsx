import React, { PureComponent } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  deleteIcon,
  backIcon,
} from '../assets';
import {
  deleteNote as remove,
  updateNote,
  getNote,
} from '../api';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      note: undefined,
      id: undefined,
      title: '',
      body: '',
      isDifferent: false,
    };
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    L I F E C Y C L E    L I F E C Y C L E    L I F E C Y C L E
  //
  /////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    const {
      match,
      history,
      notes,
    } = this.props;
    const id = Number(match.params.id);
    // Check state for the note we're editing, otherwise make a
    // call to the server
    const note = notes.find((n) => n.id === id);
    if (note) {
      this.setState({
        id,
        title: note.title,
        body: note.body,
        note,
      });
    } else {
      getNote(id)
      .then((res) => {
        // If user routed to a note that doesn't exist we redirect to the first page of notes
        if (!res) {
          history.push('/');
        } else {
          this.setState({
            id,
            title: res.data.title,
            body: res.data.body,
            note: res.data,
          });
        }
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

  onDelete() {
    const {
      history,
      deleteNote,
    } = this.props;
    const { note } = this.state;

    // Delete note on server
    remove(note)
      .then((res) => {
        // Update state to match server
        deleteNote(note);
        history.goBack();
      });
  }

  onSave() {
    const { update } = this.props;
    const {
      id,
      title,
      body,
    } = this.state;

    const newNote = {
      id,
      title,
      body,
    };
    updateNote(id, newNote)
      .then((res) => {
        update(newNote);
        this.setState({ note: newNote }, () => this.isDifferent());
      });
  }

  handleChangeTitle(e) {
    // This pattern changes state and guarantees that the callback
    // function happens after the state change
    this.setState({ title: e.target.value }, () => this.isDifferent());
  }

  handleChangeBody(e) {
    this.setState({ body: e.target.value }, () => this.isDifferent());
  }

  isDifferent() {
    const {
      title,
      body,
      note,
    } = this.state;

    if (title !== note.title || body !== note.body) {
      this.setState({
        isDifferent: true,
      });
    } else {
      this.setState({
        isDifferent: false,
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    R E N D E R    R E N D E R    R E N D E R    R E N D E R
  //
  /////////////////////////////////////////////////////////////////////////

  render() {
    const {
      title,
      body,
      isDifferent,
    } = this.state;
    const {
      history,
    } = this.props;

    // Conditionally render the save button if the current content differs from
    // the original notes content
    let displaySave = '';
    if (!isDifferent) displaySave = 'hidden';

    return (
      <div className="md:w-2/5 md:py-10 h-full w-full flex flex-col rounded-md  mx-auto">
        <div className="border h-12 flex items-center px-2 rounded-md rounded-b-none">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="h-8 w-8 flex rounded-full border justify-center items-center bg-white"
          >
            <img
              alt="back"
              src={backIcon}
              className="h-4 w-4"
            />
          </button>
          <input
            type="text"
            placeholder="Please enter a title."
            className="md:w-5/12 w-2/5 h-10 bg-gray-200 outline-none ml-4 w-auto font-thin mr-auto"
            value={title || ''}
            onChange={(e) => this.handleChangeTitle(e)}
          />
          <button
            type="button"
            className={`${displaySave} md:w-40 w-32 h-8 mr-2 rounded-full border bg-white text-xs font-thin bg-blue-400 text-white`}
            onClick={() => this.onSave()}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="h-8 w-8 flex rounded-full border justify-center items-center bg-red-300"
            onClick={() => this.onDelete()}
          >
            <img
              alt="delete"
              src={deleteIcon}
              className="h-4 w-4"
            />
          </button>
        </div>
        <textarea
          placeholder="Write your note here."
          className="flex w-full h-full border outline-none p-8 rounded-md rounded-t-none font-thin"
          value={body || ''}
          onChange={(e) => this.handleChangeBody(e)}
        />
      </div>
    );
  }
}

export default withRouter(Editor);
