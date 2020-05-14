import React, { PureComponent } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  addIcon,
} from '../assets';
import {
  addNote,
} from '../api/api';

class Home extends PureComponent {
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

  /////////////////////////////////////////////////////////////////////////
  //
  //    R E N D E R    R E N D E R    R E N D E R    R E N D E R
  //
  /////////////////////////////////////////////////////////////////////////

  renderNotes() {
    const {
      notes,
    } = this.props;

    const reversed = notes.reverse();

    return reversed.map(note => {
      return (
        <Link
          to={`/note/${note.id}`}
          className="h-40 w-32 border rounded-md bg-white m-2 overflow-hidden"
          key={note.id}
        >
          <h1 className="text-sm m-2 mb-1 border-b truncate h-5">{note.title}</h1>
          <p className="mx-2 leading-relaxed text-xs">
            {note.body}
          </p>
        </Link>
      );
    })
  }

  render() {
    return (
      <div className="p-20 ml-4 flex flex-wrap content-start overflow-scroll">
        <button
          className="h-40 w-32 flex flex-col items-center justify-center border rounded-md bg-white m-2 outline-none font-thin"
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
    );
  }
}

export default withRouter(Home);
