function scopeFormatter(scope: number) {
    switch (scope) {
        case 1:
            return "Singleton";
        case 0:
        default:
            return "Transient";
    }
}

export default scopeFormatter;
