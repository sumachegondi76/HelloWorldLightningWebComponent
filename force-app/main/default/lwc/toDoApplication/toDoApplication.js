import { LightningElement } from "lwc";

export default class ToDoApplication extends LightningElement {
  taskname = "";
  taskdate = null;
  incompletetask = [];
  completetask = [];
  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "taskname") {
      this.taskname = value;
    } else if (name === "taskdate") {
      this.taskdate = value;
    }
  }
  resetHandler() {
    this.taskname = "";
    this.taskdate = null;
  }
  addTaskHandler() {
    if (!this.taskdate) {
      this.taskdate = new Date().toISOString().slice(0, 10);
    }
    if (this.validateTask()) {
      this.incompletetask = [
        ...this.incompletetask,
        {
          taskname: this.taskname,
          taskdate: this.taskdate
        }
      ];
      this.resetHandler();
      let sortedArray = this.sortTask(this.incompletetask);
      this.incompletetask = [...sortedArray];
      console.log("this.iincompletetask");
    }
  }

  validateTask() {
    let isValid = true;
    let element = this.template.querySelector(".taskname");
    if (!this.taskname) {
      isValid = false;
    } else {
      let taskItem = this.incompletetask.find(
        (currItem) =>
          currItem.taskname === this.taskname &&
          currItem.taskdate === this.taskdate
      );
      if (taskItem) {
        isValid = false;
        element.setCustomValidity("Task is Already Available");
      }
    }
  }
  sortTask(inputArr) {
    let sortedArray = inputArr.sort((a, b) => {
      const dateA = new Date(a.taskdate);
      const dateB = new dateA(b.taskdate);
      return dateA - dateB;
    });
    return sortedArray;
  }
  removeHandler(event) {
    let index = event.target.name;
    this.incompletetask.splice(index, 1);
    let sortedArray = this.sortTask(this.incompletetask);
    this.incompletetask = [...sortedArray];
    console.log("this.incompletetask", this.incompletetask);
  }
  completetaskHandler(event) {
    let index = event.target.name;
    let removeItem = this.incompletetask.splice(index, 1);
    let sortedArray = this.sortTask(this.incompletetask);
    this.incompletetask = [...sortedArray];
    console.log("this.incompletetask", this.incompletetask);
    this.completetask = [...this.completetask, removeItem[0]];
  }
}
