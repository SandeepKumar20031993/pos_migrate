import React from 'react';
import Header from '../components/theme/header';

class Layout extends React.Component {
    render() {
        return (
            <div>
                <Header />

                <main>
                    {this.props.children}
                </main>

                <footer>
                    {/* Render any footer content here */}
                </footer>
            </div>
        );
    }
}

export default Layout;
