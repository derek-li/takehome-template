import React, { PureComponent } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  addIcon,
  nextIcon,
  prevIcon,
} from '../assets';
import {
  addNote,
} from '../api';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state ={
      page: 1,
    };
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

  handleNewNote() {
    const {
      newNote,
      history,
    } = this.props;
    const note = {
      title: '',
      body: '',
    };

    addNote(note)
      .then(res => {
        // Add new note to state
        newNote({
          id: res.data,
          title: res.config.data.title,
          body: res.config.data.body,
        });
        history.push('/note/' + res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  loadPrevPage() {
    const { page } = this.state;
    this.setState({ page: page - 1 });
  }

  loadNextPage() {
    const { page } = this.state;
    const { getNotes } = this.props;
    getNotes();
    this.setState({ page: page + 1 });
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    R E N D E R    R E N D E R    R E N D E R    R E N D E R
  //
  /////////////////////////////////////////////////////////////////////////

  renderPageInfo() {
    const {
      page,
    } = this.state;
    const {
      notes,
    } = this.props;

    // Calculate the indices of documents we're displaying
    const start = (page - 1) * 27 + 1;
    const end = page * 27;
    return (
      <div className="text-xs ml-auto">
        {start} - {notes.length > end ? end : notes.length} of {notes.length}
      </div>
    );
  }

  renderNotes() {
    const {
      notes,
    } = this.props;
    const {
      page,
    } = this.state;

    let startIndex = notes.length - page * 27;
    let endIndex = startIndex + 27;
    if (startIndex < 0) {
      startIndex = 0;
    }

    // Grab the portion of notes we'd like to display
    const notesPortion = notes.slice(startIndex, endIndex);

    // Render the newest notes first
    notesPortion.reverse();
    return notesPortion.map(note => {
      return (
        <Link
          to={`/note/${note.id}`}
          className="md:m-2 h-40 w-32 border rounded-md bg-white mx-auto my-2 overflow-hidden"
          key={note.id}
        >
          <h1 className="text-sm m-2 mb-1 border-b truncate h-5">{note.title}</h1>
          <p className="mx-2 leading-relaxed text-xs">
            {note.body}
          </p>
        </Link>
      );
    });
  }

  render() {
    const {
      page,
    } = this.state;
    const {
      notes,
    } = this.props;

    // Determine if there are valid pages to the left or right
    const nextPageDisabled = (page * 27) > notes.length;
    const prevPageDisabled = page === 1;

    return (
      <div className="p-8 flex flex-col items-center">
        <div className="md:w-7/12 md:ml-0 ml-auto flex mb-2 justify-center items-center">
          {this.renderPageInfo()}
          <button
            disabled={prevPageDisabled}
            className="mx-2 h-6 w-6 flex rounded-full border justify-center items-center bg-white"
            onClick={() => this.loadPrevPage()}
          >
            <img
              alt="previous page"
              src={prevIcon}
              className="h-2 w-2"
            />
          </button>
          <button
            disabled={nextPageDisabled}
            className="h-6 w-6 flex rounded-full border justify-center items-center bg-white"
            onClick={() => this.loadNextPage()}
          >
            <img
              alt="next page"
              src={nextIcon}
              className="h-2 w-2"
            />
          </button>
        </div>
        <div className="md:w-7/12 flex flex-wrap w-auto content-start overflow-scroll">
          <button
            className="md:m-2 my-2 mx-auto h-40 w-32 flex flex-col items-center justify-center border rounded-md bg-white outline-none font-thin"
            onClick={() => this.handleNewNote()}
          >
            <img
              alt="new note"
              src={addIcon}
              className="h-8 w-8 mb-2"
            />
            <h1 className="text-xs">Create New Note</h1>
          </button>
          {this.renderNotes()}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
