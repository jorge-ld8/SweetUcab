import styles from '../components/crud.module.css';
import React, { ReactNode } from 'react';

type ErrorProps = {
    touched: boolean,
    errors: string,
}

const ErrorMessage: React.FC<ErrorProps> = (props)=>
{
    let mainBool = props.touched && props.errors;
    return({mainBool} ? (
        <div className={styles.errorMessage}>{props.errors}</div>
      ) : null);
};

export default ErrorMessage;