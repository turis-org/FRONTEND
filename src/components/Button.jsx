// components/Button.jsx
import './Button.css'
import { Link } from 'react-router-dom';

export default function Button({
    children,
    onClick,
    disabled=false,
    variant = 'default',
    to, // <--- Добавили поддержку to
}) {

    const classNames = `btn ${variant}`;

    if (to) {
        return (
            <Link to={to} className={classNames}>
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={classNames}
        >
            {children}
        </button>
    );
}
