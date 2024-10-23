const SimpleDatabase = require("./database")

const argv = process.argv.slice(2)
const typeContent = argv[0]
const listFilter = argv[1]
const getIdNote = argv[1]
const valueNote = argv[typeContent == "add"? 1 : 2]

const db = new SimpleDatabase()

switch(typeContent) {
  case "add": case "update": {
    if(typeContent === "update" && !getIdNote) {
      console.error("[Error]: Please assign an id for this content change!")
      process.exit(1)
    }
    if(!valueNote || valueNote.length < 1) {
      console.error("[Error]: Please input task or text so short!")
      process.exit(1)
    }
    let setResult = {}
    if(typeContent == "update") {
      setResult = db.updateNote(Number(getIdNote), valueNote)
    } else {
      setResult = db.addingNote(valueNote)
    }
    if(setResult.error) {
      console.error("[Error]:", setResult.error)
      process.exit(1)
    }
    console.log(`✨ Success ${typeContent} note!`)
  } break;
  case "delete": {
    if(!getIdNote) {
      console.error("[Error]: Please assign an id for this content change!")
      process.exit(1)
    }
    const result = db.deleteNote(Number(getIdNote))
    if(result.error) {
      console.error("[Error]:", result.error)
      process.exit(1)
    }
    console.log(`✨ Success ${typeContent} note!`)
  } break;
  case "mark-in-progress": case "mark-done": {
    const contentUpdate = typeContent.replace("mark-", "")
    if(!getIdNote) {
      console.error("[Error]: Please assign an id for this content change!")
      process.exit(1)
    }
    const result = db.updateStatusNote(Number(getIdNote), contentUpdate)
    if(result.error) {
      console.error("[Error]:", result.error)
      process.exit(1)
    }
    console.log(`✨ Success change status note to ${contentUpdate} !`)
  } break;
  case "list": {
    const showAllNote = db.readAllNote().data
    const filterNote = {
      todo: showAllNote.filter(a => a.status == "todo"),
      "in-progress": showAllNote.filter(a => a.status == "in-progress"),
      done: showAllNote.filter(a => a.status == "done"),
    }
    const listFilter = Object.keys(filterNote)
    let filterNoteByString = ''

    for(let keyStatus of listFilter) {
      filterNoteByString += `\n\n [ ${keyStatus.slice(0,1).toUpperCase()}${keyStatus.slice(1)} ]\n\n`
      if(filterNote[keyStatus].length < 1) {
        filterNoteByString += "No note in this progress!"
      } else {
        filterNoteByString += filterNote[keyStatus].map(a => `-----\nID: ${a.id}\nNote: ${a.note}\n`).join("")
      }
      if(filterNote[keyStatus].length > 1) {
        filterNoteByString += '-----'
      }
    }

    console.log(filterNoteByString.trimStart()+"\n")
  } break;
  default: {
    console.log(`Usage: node main.js [type] [...more]
      
 TYPES
 - add              Add a new task record with default status “todo”
 - update           Updates the content of your new task note
 - delete           Delete your task record in the data
 - mark-in-progress Update your task status to “in-progress”
 - mark-done        Update your task status to “done”
 - list             Shows a list of tasks in the status record of each status, you can add the "done", "todo" or "in-progress" filters to view them.\n`)
  }
}