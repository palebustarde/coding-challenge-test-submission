import { useState, useCallback } from 'react';
import { FormFields } from '@/types';

function useFormFields(initialFields: FormFields) {
    const [fields, setFields] = useState(initialFields);
    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFields((prevFields) => ({ ...prevFields, [name]: value }));
    }, []);

    return { fields, onChange };
};

export default useFormFields;