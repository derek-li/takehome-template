import React, { PureComponent } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  deleteIcon,
  backIcon,
} from '../assets';
import {
  deleteNote as remove,
  updateNote,
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

  static getDerivedStateFromProps(props, state) {
    const note = props.notes.find(note => note.id.toString() === props.match.params.id);

    if (!note) return null;

    const {
      id,
      title,
      body,
    } = note;

    if (id !== state.id) {
      return {
        note,
        id,
        title,
        body,
      };
    }
  
    return null;
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

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

  handleChangeTitle(e) {
    // Pattern changes state and guarantees that the callback
    // function happens after the state change
    this.setState({ title: e.target.value }, () => this.isDifferent());
    
  }
  
  handleChangeBody(e) {
    this.setState({ body: e.target.value }, () => this.isDifferent());
  }

  onSave() {
    const { update } = this.props;
    const { 
      id,
      title,
      body,
      note,
    } = this.state;

    const newNote = {
      id,
      title,
      body,
    };
    updateNote(note, newNote)
      .then(res => {
        update(newNote);
        this.setState({ note: newNote }, () => this.isDifferent());
      })
      .catch(err => {
        console.log(err);
      });
  }

  onDelete() {
    const {
      history,
      deleteNote,
    } = this.props;
    const { note } = this.state;

    // Delete note on server
    remove(note)
      .then(res => {
        // Update state to match server
        deleteNote(note);
        history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
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
      note,
      isDifferent,
    } = this.state;

    // Note has been deleted or is missing for whatever reason
    if (!note) {
      return (
        <Link
          to="/"
          className="h-full w-full py-10 mx-40 font-thin"
        >
          This note no longer exists, click anywhere to go back.
        </Link>
      );
    }

    // Conditionally render the save button
    let displaySave = '';
    if (!isDifferent) displaySave = 'hidden';

    return (
      <div className="h-full w-full flex flex-col rounded-md py-10 mx-40">
        <div className="border h-12 flex items-center px-2 rounded-md rounded-b-none">
          <Link
            to="/"
            className="h-8 w-8 flex rounded-full border justify-center items-center bg-white"
          >
            <img
              alt="back"
              src={backIcon}
              className="h-4 w-4"
            />
          </Link>
          <input
            type="text"
            placeholder="Please enter a title."
            className="h-10 bg-gray-200 outline-none ml-4 w-2/3 font-thin mr-auto"
            value={title}
            onChange={(e) => this.handleChangeTitle(e)}
          />
          <button
            className={`${displaySave} h-8 w-40 mr-2 rounded-full border bg-white text-xs font-thin bg-blue-400 text-white`}
            onClick={() => this.onSave()}
          >
            Save Changes
          </button>
          <button
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
          value={body}
          onChange={(e) => this.handleChangeBody(e)}
        />
      </div>
    );
  }
}

export default withRouter(Editor);
