const fs = require("fs")

class SimpleDatabaseForTask {
  constructor() {
    this.datapath = `${process.cwd()}/data.json`
    this.status_note = ["todo","in-progress","done"]
    this.healthCheck() // checking database
  }
  writeingData(data) {
    fs.writeFileSync(this.datapath, JSON.stringify(data,null,2), "utf-8")
  }
  readingData() {
    const data = fs.readFileSync(this.datapath, "utf-8")
    return JSON.parse(data)
  }
  healthCheck() {
    try {
      if(!fs.existsSync(this.datapath) || !fs.lstatSync(this.datapath).isFile()) {
        this.writeingData([]) // Create file if file database not found
      }
      const readly = fs.readFileSync(this.datapath)
      JSON.parse(readly)
      return { status: "Normal" }
    } catch(err) {
      fs.rmSync(this.datapath) // Remove old database
      this.writeingData([]) // Create new file database
      console.log("ErrorHealth:", err)
      return { status: "Error" }
    }
  }
  readAllNote() {
    const read = this.readingData()
    return {
      data: read.map((a, i) => ({
        id: i,
        ...a
      }))
    }
  }
  addingNote(notes) {
    const read = this.readingData()
    const toData = [
      { status: "todo", date: new Date().getTime(), note: String(notes) },
      ...read
    ].filter(a => !!(a.status && a.note && this.status_note.includes(a.status)))
    this.writeingData(toData)
    return {
      success: true
    }
  }
  updateNote(id, notes) {
    const read = this.readingData()
    if(!read[Number(id)]) {
      return {
        error: `Note id '${id}' is not found!`
      }
    }
    let toData = read
    read[id] = {
      status: read[id].status,
      date: read[id].date,
      note: notes
    }
    this.writeingData(toData)
    return {
      success: true
    }
  }
  deleteNote(id) {
    const read = this.readingData()
    if(!read[Number(id)]) {
      return {
        error: `Note id '${id}' is not found!`
      }
    }
    const toData = read
        .filter(a => a.id != id) // Remove from list (by filter)
        .filter(a => !!(a.status && a.note && this.status_note.includes(a.status)))
    this.writeingData(toData)
    return {
      success: true
    }
  }
  updateStatusNote(id, status) {
    const read = this.readingData()
    if(!read[Number(id)]) {
      return {
        error: `Note id '${id}' is not found!`
      }
    }
    if(!this.status_note.includes(status)) {
      return {
        error: `Status can't be set ${status}, only set to ${this.status_note.join(", ")}`
      }
    }
    let toData = read
    read[id] = {
      status: status,
      date: read[id].date,
      note: read[id].note
    }
    this.writeingData(toData)
    return {
      success: true
    }
  }
}

module.exports = SimpleDatabaseForTask