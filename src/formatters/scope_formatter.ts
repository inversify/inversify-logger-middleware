function scopeFormatter(scope: number) {
    switch (scope) {
        case 1:
            return "Singleton";
        case 0:
            return "Transient";
    }
}

export default scopeFormatter;
