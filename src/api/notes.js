import axios from 'axios';

const baseURL = 'http://note.dev.cloud.lightform.com';

// Get all notes
export async function getNotes(page) {
  try {
    const result = await axios.get(baseURL + '/notes?page=' + page.toString() + '&limit=27');
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
export async function updateNote(note, updateNote) {
  try {
    const { id } = note;
    const result = await axios.patch(baseURL + '/notes/' + id, updateNote);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Delete a note
export async function deleteNote(note) {
  try {
    const { id } = note;
    const result = await axios.delete(baseURL + '/notes/' + id);
    return result;
  } catch (error) {
    console.log(error);
  }
}
