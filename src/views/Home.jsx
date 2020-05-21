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
  getNotes,
} from '../api';

class Home extends PureComponent {
  /////////////////////////////////////////////////////////////////////////
  //
  //    L I F E C Y C L E    L I F E C Y C L E    L I F E C Y C L E
  //
  /////////////////////////////////////////////////////////////////////////
  
  componentDidMount() {
    const {
      match,
      setNotes,
      visited,
      notes,
    } = this.props;

    const page = Number(match.params.pageNum);
    const startIndex = visited.indexOf(page) * 10;
    // Check if the portion of notes we're displaying does not fill the page
    const notesPortion = notes.slice(startIndex);

    // Grab all notes from a page if we haven't visited it yet
    if (visited.indexOf(page) === -1) {
      getNotes(page)
        .then((res) => {
          setNotes(res.data._embedded.notes, page, false);
          this.setState({ page });
        });
      // Fetch notes for the same page if we don't have enough notes.
      // (if we just deleted one from the current portion)
    } else if (notesPortion.length < 10) {
      getNotes(page)
        .then((res) => {
          // Only add notes we haven't already loaded
          const nextNote = [res.data._embedded.notes[9]];
          if (nextNote[0] !== undefined) {
            setNotes(nextNote, page, false);
          }
        });
    }
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
      .then((res) => {
        // Add new note to state
        newNote({
          id: res.data,
          title: res.config.data.title,
          body: res.config.data.body,
        });
        history.push('/note/'.concat(res.data.toString()));
      });
  }
  
  loadPage(direction) {
    const {
      setNotes,
      visited,
      match,
      history,
    } = this.props;

    const page = direction === 'next' ? Number(match.params.pageNum) + 1 : Number(match.params.pageNum) - 1;
    if (visited.indexOf(page) === -1) {
      getNotes(page)
      .then((res) => {
        setNotes(res.data._embedded.notes, page, direction);
      });
    }
    
    history.push('/page/'.concat(page));
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    R E N D E R    R E N D E R    R E N D E R    R E N D E R
  //
  /////////////////////////////////////////////////////////////////////////

  renderPageInfo() {
    const {
      total,
      match,
    } = this.props;

    // Calculate the indices of all documents
    const page = Number(match.params.pageNum);
    const startIndex = (page - 1) * 10 + 1;
    const endIndex = page * 10;

    // Determine if there are valid pages to the left or right
    const nextPageDisabled = (page * 10) >= total;
    const prevPageDisabled = page === 1;

    // Display nothing if we're on a page that should not exist
    if (startIndex > total) {
      return <div className="mb-8" />;
    }

    return (      
      <div className="md:w-7/12 md:ml-0 ml-auto flex mb-2 justify-center items-center">
        <div className="text-xs ml-auto">
          {startIndex} - {total > endIndex ? endIndex : total} of {total}
        </div>
        <button
          type="button"
          disabled={prevPageDisabled}
          className="mx-2 h-6 w-6 flex rounded-full border justify-center items-center bg-white"
          onClick={() => this.loadPage('prev')}
        >
          <img
            alt="previous page"
            src={prevIcon}
            className="h-2 w-2"
          />
        </button>
        <button
          type="button"
          disabled={nextPageDisabled}
          className="h-6 w-6 flex rounded-full border justify-center items-center bg-white"
          onClick={() => this.loadPage('next')}
        >
          <img
            alt="next page"
            src={nextIcon}
            className="h-2 w-2"
          />
        </button>
      </div>
    );
  }

  renderNotes() {
    const {
      notes,
      match,
      visited,
    } = this.props;

    const page = Number(match.params.pageNum);
    
    // Calculate indices of the notes we currently have
    const startIndex = visited.indexOf(page) * 10;
    const endIndex = startIndex + 10;

    // Grab the portion of notes we'd like to display
    const notesPortion = notes.slice(startIndex, endIndex);

    // Go to page 1 if there are no notes to display
    if (notesPortion.length === 0) {
      return (
        <Link
          to="/"
          className="m-2 text-sm"
        >
          No notes here. Click to go home.
        </Link>
      )
    }

    return notesPortion.map((note) => (
      <Link
        to={`/note/${note.id}`}
        className="md:m-2 h-40 w-32 border rounded-md bg-white mx-3 my-2 overflow-hidden"
        key={note.id}
      >
        <h1 className="text-sm m-2 mb-1 border-b truncate h-5">{note.title}</h1>
        <p className="mx-2 leading-relaxed text-xs break-words">
          {note.body}
        </p>
      </Link>
    ));
  }

  render() {
    return (
      <div className="w-full p-8 flex flex-col items-center">
        {this.renderPageInfo()}
        <div className="md:w-7/12 flex flex-wrap w-auto content-start overflow-scroll">
          <button
            type="button"
            className="md:m-2 my-2 mx-3 h-40 w-32 flex flex-col items-center justify-center border rounded-md bg-white outline-none font-thin"
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
