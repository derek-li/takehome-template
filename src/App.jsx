import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
      currentPage: 0,
      total: 0,
    };

    this.newNote = this.newNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.getMoreNotes = this.getMoreNotes.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    L I F E C Y C L E    L I F E C Y C L E    L I F E C Y C L E
  //
  /////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    getNotes(1)
      .then(res => {
        // Calculate pages based on total notes
        // We display 27 (arbitrary number, it looks nice) notes per page
        const pages = Math.ceil(res.data.total / 27);

        // Calculate the remainder
        // If the remainder is not 0, we must GET the page before to fill out the view
        const remainder = res.data.total % 27;
        getNotes(pages)
          .then(res => {
            this.setState({
              notes: res.data._embedded.notes,
              total: res.data.total,
              currentPage: pages,
            });

            if (remainder !== 0 && pages > 1) {
              getNotes(pages - 1)
              .then(res => {
                this.setState(prevState => ({
                  notes: [...res.data._embedded.notes, ...prevState.notes],
                  currentPage: pages - 1,
                }));
              })
              .catch(err => {
                console.log(err);
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

  getMoreNotes() {
    const { currentPage } = this.state;
    // Nothing to get
    if (currentPage - 1 <= 0) return false;
    getNotes(currentPage - 1)
      .then(res => {
        this.setState(prevState => ({
          notes: [...res.data._embedded.notes, ...prevState.notes],
          currentPage: currentPage - 1,
        }));
      })
      .catch(err => {
        console.log(err);
      });

    return true;
  }

  newNote(note) {
    this.setState(prevState => ({
      notes: [...prevState.notes, note],
    }));
  }

  deleteNote(removedNote) {
    this.setState(prevState => ({
      notes: prevState.notes.filter(note => note.id !== removedNote.id),
    }));
  }

  updateNote(newNote) {
    const { notes } = this.state;
    const updatedNotes = notes.slice();
    
    // Find and replace the note with the updated version
    const indexOfOldNote = notes.findIndex(note => note.id === newNote.id);
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
      currentPage,
    } = this.state;

    return (
      <div className="App flex h-screen m-auto bg-gray-200 font-thin">
        <Router>
          <Switch>
            <Route path="/note/:id">
              <Editor
                deleteNote={this.deleteNote}
                update={this.updateNote}
                notes={notes}
              />
            </Route>
            <Route path="/">
              <Home
                notes={notes}
                newNote={this.newNote}
                total={total}
                page={currentPage}
                getNotes={this.getMoreNotes}
              />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
