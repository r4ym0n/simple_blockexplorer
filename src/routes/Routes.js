import {BrowserRouter, Routes, Route, useHistory} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

function AppRoutes() {

    return (
      <BrowserRouter>
        <Routes>
          <Route exact  path="/" element={<Dashboard/>} />
          {/* <Route path="/address" component={Address} />
          <Route path="/transaction" component={Transaction} />
          <Route path="/block" component={Block} /> */}
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default AppRoutes;