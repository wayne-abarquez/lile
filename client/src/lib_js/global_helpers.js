// Utility method for formatting strings
// e.g. "Project {0} is {1}".format("cesar", "awesome");
// also "Project {name} is {adjective".format({name:"cesar", adjective:"awesome"});
if (!String.prototype.format) {
    String.prototype.format = function () {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}