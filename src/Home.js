import NavEventChart from './NavEventChart';
import Blacklist from "./Blacklist";
import NavEvents from "./NavEvents";
import Config from "./Config";
import Chart from 'chart.js';
import Element from './Element'

const BLACKLIST_ID = "urlBlacklist";
const BLACKLIST_INPUT_ID = "blackListInput";
const DELAY_TIME_INPUT_ID = "delayTimeInput";
const DELAY_TIME_OUTPUT_ID = "delayTimeOutput";

export default class Home {

  static clearBlacklistUrlInput() {
    const blackListInput = Element.getElementById(BLACKLIST_INPUT_ID);
    blackListInput.value = '';
  }
  
  static onDeleteClicked(event) {
    const blacklist = Blacklist.load();
    const index = blacklist.indexOf(event.srcElement.previousSibling)
    blacklist.splice(index, 1);
    Blacklist.save(blacklist);
    delete event.srcElement.parentNode.remove();  
  }
  
  static createDeleteButton() {
    const deleteButton = document.createElement("Button");
    deleteButton.id = "deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => this.onDeleteClicked(event))
    return deleteButton;
  }
  
  static createNewBlacklistLiElement(url) {
    const newUrlLi = document.createElement("li");
    newUrlLi.textContent = url;
    const deleteButton = this.createDeleteButton();
    newUrlLi.appendChild(deleteButton);
    return newUrlLi;  
  }
  
  static addNewUrlElementToBlacklist(url) {
    console.log(BLACKLIST_ID);
    const urlBlacklist = Element.getById(BLACKLIST_ID);
    const newUrlLi = this.createNewBlacklistLiElement(url);
    urlBlacklist.appendChild(newUrlLi);
  }
  
  static submitNewUrl() {
    const url = Element.getValueFromId(BLACKLIST_INPUT_ID);
    this.addNewUrlElementToBlacklist(url);
    Blacklist.addNewUrl(url);  
    this.clearBlacklistUrlInput();
  }

  static setDelayTime() {
    const time = Element.getValueFromId(DELAY_TIME_INPUT_ID);
    Config.setDelayTime(time);
    this.setDelayTimeOutputElement(time);
  }

  static buildInitialBlacklist() {
    const blacklist = Blacklist.load();
    for(let index in blacklist) {
      const url = blacklist[index].url;
      this.addNewUrlElementToBlacklist(url);
    }
  }

  static setDelayTimeOutputElement(time) {
    const delayTimeElement = Element.getById(DELAY_TIME_OUTPUT_ID);
    delayTimeElement.textContent = time;  
  }

  static setInitalDelayTimeElement() {
    this.setDelayTimeOutputElement(Config.getDelayTime()); 
  }
}

document.getElementById("blacklistSubmit").addEventListener("click", () => Home.submitNewUrl());
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});//submitNewUrl);

document.getElementById("delayTimeSubmit").addEventListener("click", () => Home.setDelayTime());

window.addEventListener("load", function load(event){ 
  Home.buildInitialBlacklist();
  Home.setInitalDelayTimeElement();
});

NavEventChart.initialiseGraph();