const useChangeData = (name , value, isNumeric=false , setterFunc) => {
    if(isNumeric && (isNaN(value) || value.toString().includes('.'))) return;
    setterFunc(prev => ({...prev , [name] : value}));
}  

export default useChangeData;