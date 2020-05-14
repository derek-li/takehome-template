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
      // loaded: 0,
    };

    this.newNote = this.newNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    L I F E C Y C L E    L I F E C Y C L E    L I F E C Y C L E
  //
  /////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    getNotes()
      .then(res => {
        this.setState(prevState => ({
          notes: res.data._embedded.notes,
          // loaded: prevState.loaded += 10,
        }));
      })
      .catch(err => {
        console.log(err);
      })
  }

  /////////////////////////////////////////////////////////////////////////
  //
  //    H E L P E R S    H E L P E R S    H E L P E R S    H E L P E R S
  //
  /////////////////////////////////////////////////////////////////////////

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
              />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
