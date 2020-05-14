import axios from 'axios';

const baseURL = 'http://note.dev.cloud.lightform.com';

// Get all notes
export async function getNotes() {
  try {
    const result = await axios.get(baseURL + '/notes?page=1&limit=100');
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Create note
export async function addNote(newNote) {
  try {
    const result = await axios.post(baseURL + '/notes', newNote);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get specific note
export async function getNote(note) {
  try {
    const { id } = note;
    const result = await axios.get(baseURL + '/notes/' + id);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Update a note
export async function updateNote(note, data) {
  try {
    const { id } = note;
    const result = await axios.patch(baseURL + '/notes/' + id, data);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Delete a note
export async function deleteNote(id) {
  try {
    const result = await axios.delete(baseURL + '/notes/' + id);
    return result;
  } catch (error) {
    console.log(error);
  }
}
