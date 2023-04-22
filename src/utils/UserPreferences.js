import { topics } from "@/web/topics";

export default class UserPreferences {
  constructor() {
    topicsPreferences = {};
    for (let topic of topics) {
      topicsPreferences[topic] = 0;
    }
    this._topicsPreferences = topicsPreferences;
  }

  /**
   * This method returns the topics preferences.
   * @returns {Object} - object storing the topics preferences.
   *
   * @example <caption>Example usage of getTopicsPreferences method.</caption>
   * returns { "art": 0, "business": 0, "computers": 0, "games": 0, "health": 0, "home": 0, "news": 0, "recreation": 0, "reference": 0, "regional": 0, "science": 0, "shopping": 0, "society": 0, "sports": 0, "kids and teens": 0, "world": 0 }
   */
  getTopicsPreferences() {
    if (localStorage.getItem("topicsPreferences") !== null) {
      const topicsPreferences = JSON.parse(
        localStorage.getItem("topicsPreferences")
      );
      this._topicsPreferences = topicsPreferences;
    }
    return topicsPreferences;
  }

  /**
   * This method sets the topics preferences.
   * @param {Object} topicsPreferences - object storing the topics preferences.
   * @returns {Object} - object storing the topics preferences.
   * @example <caption>Example usage of setTopicsPreferences method.</caption>
   * topicsPreferences = { "art": 1, "business": 0, "computers": 0, "games": 0, "health": 0, "home": 0, "news": 0, "recreation": 0, "reference": 0, "regional": 0, "science": 0, "shopping": 0, "society": 0, "sports": 0, "kids and teens": 0, "world": 0 }
   * returns { "art": 1, "business": 0, "computers": 0, "games": 0, "health": 0, "home": 0, "news": 0, "recreation": 0, "reference": 0, "regional": 0, "science": 0, "shopping": 0, "society": 0, "sports": 0, "kids and teens": 0, "world": 0 }
   * @throws {Error} - if the topicsPreferences parameter is not an object.
   * @throws {Error} - if the topicsPreferences parameter is an empty object.
   */
  setTopicsPreferences(topicsPreferences) {
    if (typeof topicsPreferences !== "object") {
      throw new Error("topicsPreferences parameter is not an object.");
    }
    if (Object.keys(topicsPreferences).length === 0) {
      throw new Error("topicsPreferences parameter is an empty object.");
    }
    localStorage.setItem(
      "topicsPreferences",
      JSON.stringify(topicsPreferences)
    );
    this._topicsPreferences = topicsPreferences;
    return topicsPreferences;
  }

  /**
   * This method returns the topic preference.
   * @param {string} topic - topic to get the preference.
   * @returns {number} - topic preference.
   * @example <caption>Example usage of getTopicPreference method.</caption>
   * topic = "art"
   * returns 1
   */
  getTopicPreference(topic) {
    if (localStorage.getItem("topicsPreferences") !== null) {
      const topicsPreferences = JSON.parse(
        localStorage.getItem("topicsPreferences")
      );
      this._topicsPreferences = topicsPreferences;
    }
    return this._topicsPreferences[topic];
  }

  /**
   * This method sets the topic preference.
   * @param {string} topic - topic to set the preference.
   * @param {number} preference - topic preference.
   * @returns {number} - topic preference.
   */
  setTopicPreference(topic, preference) {
    if (localStorage.getItem("topicsPreferences") !== null) {
      const topicsPreferences = JSON.parse(
        localStorage.getItem("topicsPreferences")
      );
      this._topicsPreferences = topicsPreferences;
    }
    this._topicsPreferences[topic] = preference;
    localStorage.setItem(
      "topicsPreferences",
      JSON.stringify(this._topicsPreferences)
    );
    return preference;
  }
}
