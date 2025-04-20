import { useState, useEffect } from "react";
import { Post } from "../../../utils/https";

const useFetchData = (url, param) => {
    const [data, setData] = useState(null);
    const [fetchError, setfetchError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Post(url, param ? param : null);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setfetchError(res.data.errorMessage);
                }
            } catch (error) {
                setfetchError(error.message);
            }
        };

        fetchData();
    }, [url]);

    return { data, fetchError };
}

export default useFetchData;
