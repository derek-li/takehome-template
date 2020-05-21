import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  Home,
  Editor,
} from './views';
import {
  getNotes,
} from './api';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      lastPage: 0,
      total: 0,
      visited: [],
    };

    this.newNote = this.newNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.setNotes = this.setNotes.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    L I F E C Y C L E    L I F E C Y C L E    L I F E C Y C L E
  //
  /////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    getNotes(1)
      .then((res) => {
        // Calculate total pages for pagination based on total notes
        const lastPage = Math.ceil(res.data.total / 10);

        this.setState({
          total: res.data.total,
          lastPage,
        });
      });
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

  setNotes(newNotes, visitedPage, direction) {
    const { visited } = this.state;

    // Depending if we're moving to a previous page or next page, we
    // append the new notes to the back/front relatively
    if (direction === 'prev') {
      this.setState(prevState => ({
        notes: [...newNotes, ...prevState.notes],
      }));
    } else {
      this.setState(prevState => ({
        notes: [...prevState.notes, ...newNotes],
      }));
    }

    // Store the page we are currently visiting so we don't fetch upon
    // revisiting
    if (visited.indexOf(visitedPage) === -1) {
      this.setState(prevState => ({
        visited: [...prevState.visited, visitedPage].sort((a, b) => a - b),
      }));
    }
  }

  newNote(note) {
    const {
      lastPage,
      visited,
      total,
    } = this.state;
    // If we are at or have visited the last page of pagination we append
    // the new note to the notes array, otherwise we'll wait to reach the
    // last page to have access to it
    if (visited.indexOf(lastPage) !== -1) {
      this.setState((prevState) => ({
        notes: [...prevState.notes, note],
      }));
    }
    this.setState({ total: total + 1 });
  }

  deleteNote(removedNote) {
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => note.id !== removedNote.id),
      total: prevState.total - 1,
    }));
  }

  updateNote(newNote) {
    const { notes } = this.state;
    const updatedNotes = notes.slice();

    // Find and replace the note with the updated version
    const indexOfOldNote = notes.findIndex((note) => note.id === newNote.id);
    // If we can't find it, we don't need to replace anything. Just
    // wait until we fetch the page containing the note
    if (indexOfOldNote === -1) return;

    updatedNotes.splice(indexOfOldNote, 1, newNote);
    this.setState({
      notes: updatedNotes,
    });
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    R E N D E R    R E N D E R    R E N D E R    R E N D E R
  //
  /////////////////////////////////////////////////////////////////////////

  render() {
    const {
      notes,
      total,
      visited,
    } = this.state;

    return (
      <div className="md:w-full flex h-screen m-auto bg-gray-200 font-thin">
        <Router>
          <Switch>
            <Route path="/note/:id">
              <Editor
                deleteNote={this.deleteNote}
                update={this.updateNote}
                notes={notes}
              />
            </Route>
            <Route path="/page/:pageNum">
              <Home
                notes={notes}
                newNote={this.newNote}
                total={total}
                setNotes={this.setNotes}
                visited={visited}
              />
            </Route>
            <Route path="/">
              <Redirect to="/page/1" />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
