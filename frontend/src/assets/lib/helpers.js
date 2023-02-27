function cut_text(text, max_length=20){
    if(text.length > max_length){
        return `${text.slice(0, max_length)}...`;
    }
    return text;
}

export {cut_text};