import axios from "axios";

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

export const handleCorporateChange = async (itemValue , setCorporateList , setLoading ,setCorpType ,user) => {
    console.log(itemValue);
    if(itemValue === 'select') return;
    setCorpType(itemValue[0]);
    try{
      const res = await axios.post(`http://182.70.253.15:8000/api/Corporate-Name` , {
        corporate_id: itemValue[1]
      } , {
        withCredentials: true,
        headers:{ 
          Authorization: `Bearer ${user.access}`
        }
      })
      setCorporateList([...res.data]);
    }catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

export default useChangeData;
