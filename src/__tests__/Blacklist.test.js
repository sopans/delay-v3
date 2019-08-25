
import LocalStorageService from '../services/LocalStorageService';
import Blacklist from '../Blacklist';
import shortId from "shortid";

const URL_REDDIT = {id: 1, url: "wwww.reddit.com", navEvents: []};
const URL_REDDIT_CLICKED = {...URL_REDDIT};
const URL_REDDIT_LOADED = {...URL_REDDIT_CLICKED};
const URL_FACEBOOK = {id: 2, url: "wwww.facebook.com", navEvents: []};
const URL_TWITTER = {id: 3, url: "wwww.twitter.com", navEvents: []};
const URL_TWITTER_CLICKED = {...URL_TWITTER};

const BLACKLIST = [URL_REDDIT, URL_FACEBOOK];
const UPDATED_BLACKLIST = [...BLACKLIST, URL_TWITTER];
const CLICKED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];
const LOADED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];

test("updateEntry: updates existing entry", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  LocalStorageService.saveObject = jest.fn();
  Blacklist.updateEntry(URL_REDDIT_CLICKED);

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("updateEntry: entry doesn't exist, doesn't update blacklist", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue(BLACKLIST);
  LocalStorageService.saveObject = jest.fn();
  Blacklist.updateEntry({ ...URL_TWITTER });

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(0);
})

test("load: standard load", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();

  const blacklist = Blacklist.load()
  expect(blacklist).toEqual(BLACKLIST);
})

test("load: loads in base object", () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([]);
    LocalStorageService.saveObject = jest.fn();
    
    const blacklist = Blacklist.load()
  expect(blacklist).toEqual([]);
})

test("save", () => {
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.save(BLACKLIST);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", BLACKLIST);
})

test("addNewUrl", () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([...BLACKLIST]);
    LocalStorageService.saveObject = jest.fn();
  shortId.generate = jest.fn().mockReturnValue(URL_TWITTER.id);

  Blacklist.addNewUrl(URL_TWITTER.url);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", UPDATED_BLACKLIST);
})