export const findFolder = (folders=[], folderId) => 
  folders.find(folder => folder.id === folderId)

export const findNote = (notes=[], noteId) =>
  notes.find(note => {
      return note.id === Number(noteId)})

export const getNotesForFolder = (notes=[], folderId) => (
  (!folderId)
    ? notes
    : notes.filter(note => note.folder === Number(folderId)
))

export const countNotesForFolder = (notes=[], folderId) =>
  notes.filter(note => note.folder === folderId).length