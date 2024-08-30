const useChangeData = (name, value, isNumeric = false, setterFunc) => {
    if (isNumeric) {
        // Allow only whole numbers (no decimal points or non-numeric characters)
        if (!/^\d+$/.test(value)){
            setterFunc(prev => ({ ...prev, [name]: '' }));
            console.log('here');
            return;
        } 

        console.log('reached here');
        setterFunc(prev => ({ ...prev, [name]: Number(value) }));
        return;
    } else {
        if (/[^a-zA-Z0-9.,% ]/.test(value) || /\s{2,}/.test(value)) return;

        setterFunc(prev => ({ ...prev, [name]: value }));
    }
};

export default useChangeData;
