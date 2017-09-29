class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      this.config = config;
      this.history = [];
      this.activeIndex = -1;
      this.prevIndex = -1;
      this.nextIndex = -1;
      this.changeState(this.config.initial);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (state in this.config.states) {
        this.prevIndex = this.activeIndex;
        this.activeIndex = this.history.push(state) - 1;
        this.state = state
      } else {
        throw new Error('error');
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      var st = this.config.states[this.state].transitions[event];
      if (!st) {
        throw new Error('error');
      }
      this.changeState(st);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = null) {
      if (!event) { return Object.keys(this.config.states); }
      this.strStates = [];
      for (var key in this.config.states) {
        if (event in this.config.states[key].transitions)
        this.strStates.push(key);
      }
      return this.strStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this.history.length <= 1 || this.activeIndex < 1) {
        return false;
      }
      this.state = this.history[this.prevIndex === -1 ? this.activeIndex - 1 : this.prevIndex];
      this.nextIndex = this.activeIndex;
      this.activeIndex = this.prevIndex;
      this.prevIndex = -1;
      return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this.activeIndex === this.history.length - 1) {
        return false;
      }
      this.state = this.history[this.nextIndex === -1 ? this.activeIndex + 1 : this.nextIndex ];
      this.prevIndex = this.activeIndex
      this.activeIndex = this.nextIndex;
      this.nextIndex = -1;
      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.history = [];
      this.activeIndex = -1;
      this.prevIndex = -1;
      this.nextIndex = -1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
