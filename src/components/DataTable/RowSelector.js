import React from 'react';

// Component to render row selection checkboxes
const RowSelector = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input className="mr-t-10" type="checkbox" ref={resolvedRef} {...rest} />
        </>
    );
});

export default RowSelector;