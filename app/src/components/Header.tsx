import '../styles/header.css';

export default function Header() {
    return (
      <header>
        <nav className="header-box">
            <h1><a href="/">MOVIEBROS</a></h1>
            <div className='button-box'>
                <button><a href="/login">LOG IN</a></button>
                <button><a href="/signup">SIGN UP</a></button>
            </div>
        </nav>
      </header>
    );
  }
  