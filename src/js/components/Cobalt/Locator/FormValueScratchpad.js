import { InputHelper } from '@yext/components-search-form';

const mapsEqual = (map1, map2) => {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, val] of map1) {
    const testVal = map2.get(key);
    if (testVal !== val || (testVal === undefined && !map2.has(key))) {
      return false;
    }
  }
  return true;
};

export class FormValueScratchpad {
  constructor() {
    this.state = new Map();
  }

  registerForm(formEl) {
    this.registerInputs(formEl.children.filter((input) => input.name != ''));
  }

  registerInputs(inputs) {
    for (const input of inputs) {
      this.registerInput(input);
    }
  }

  registerInput(input) {
    const property = InputHelper.getPropertyToUpdate(input);
    this.state.set(input, input[property]);
  }

  visibleState() {
    let stateMap = new Map();
    for (const input of this.state.keys()) {
      stateMap.set(input, input[InputHelper.getPropertyToUpdate(input)]);
    }
    return stateMap;
  }

  committedState() {
    return this.state;
  }

  changesAreCommitted() {
    return mapsEqual(this.visibleState(), this.committedState());
  }

  commit() {
    for (const input of this.state.keys()) {
      const property = InputHelper.getPropertyToUpdate(input);
      this.state.set(input, input[property]);
    }
  }

  reset() {
    for (const [input, value] of this.state.entries()) {
      const propertyToUpdate = InputHelper.getPropertyToUpdate(input);
      input[propertyToUpdate] = value;
    }
  }
}
