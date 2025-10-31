import { Compiler } from "inkjs/full";

export default (source) => {
    const story = new Compiler(source).Compile();
    return `module.exports = ${story.ToJson()}`;
};
