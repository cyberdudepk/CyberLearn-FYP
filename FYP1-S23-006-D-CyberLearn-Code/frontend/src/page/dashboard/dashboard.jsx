import { Fragment, useState, useEffect } from "react";
import Footer from "../../component/layout/footer";


import Sidebar from './Sidebar/Sidebar';

import YourComponent2 from './Enrolled/Enrolled';
import YourComponent1 from './Recommend/recommended';


const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('component1');

  const components = {
    component1: <YourComponent1 />,
    component2: <YourComponent2 />,

  };

  const handleMenuItemClick = (componentKey) => {
    setActiveComponent(componentKey);
  };


  return (
    <Fragment>

    
        <div style={{ display: 'flex' }}>
            {/* Pass activeComponent to Sidebar */}
            <Sidebar onMenuItemClick={handleMenuItemClick} activeComponent={activeComponent} />
            <div style={{ marginLeft: '20%', width: '80%' }}>
                {components[activeComponent] || <div>Please select a component</div>}
            </div>
        </div>
    

    {/* <Footer /> */}
</Fragment>
  );
};

export default Dashboard;
