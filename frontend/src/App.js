import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "./pages/NotFound";
import MainPage from "./pages/visitor/MainPage";
import AboutUs from "./pages/visitor/AboutUs";
import Contact from "./pages/visitor/Contact";
import SearchMechanik from "./pages/visitor/SearchMechanik";
import Zaloguj from "./pages/visitor/Zaloguj";
import WizytyClient from "./pages/client/WizytyClient";
import WizytySzczegolyClient from "./pages/client/WizytySzczegolyClient";
import WizytaEdytujClient from "./pages/client/WizytaEdytujClient";
import WizytaDodajClient from "./pages/client/WizytaDodajClient";
import SamochodyClient from "./pages/client/SamochodyClient";
import SamochodySzczegolyClient from "./pages/client/SamochodySzczegolyClient";
import SamochodEdytujClient from "./pages/client/SamochodEdytujClient";
import ProfileSzczegoly from "./pages/client/ProfileSzczegoly";
import ProfileEdit from "./pages/client/ProfileEdit";
import Rejestracja from "./pages/visitor/Rejestracja";
import MainAdmin from "./pages/admin/MainAdmin";
import WizytyListaAdmin from "./pages/admin/WizytyListaAdmin";
import WizytySzczegolyAdmin from "./pages/admin/WizytySzczegolyAdmin";
import WizytaEditAdmin from "./pages/admin/WizytaEditAdmin";
import WizytaDodajAdmin from "./pages/admin/WizytaDodajAdmin";
import SamochodyListaAdmin from "./pages/admin/SamochodyListaAdmin";
import SamochodSzczegolyAdmin from "./pages/admin/SamochodSzczegolyAdmin";
import SamochodEditAdmin from "./pages/admin/SamochodEditAdmin";
import SamochodDodajAdmin from "./pages/admin/SamochodDodajAdmin";
import MechanicyListaAdmin from "./pages/admin/MechanikListaAdmin";
import MechanikSzczegolyAdmin from "./pages/admin/MechanikSzczegolyAdmin";
import MechanikEditAdmin from "./pages/admin/MechanikEditAdmin";
import MechanikDodajAdmin from "./pages/admin/MechanikDodajAdmin";


function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/aboutUs" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/searchMechanik" element={<SearchMechanik />}/>
                    <Route path="/zaloguj" element={<Zaloguj />}/>
                    <Route path={"/rejestracja"} element={<Rejestracja/>} />

                    <Route path="/wizyty" element={<WizytyClient />}/>
                    <Route path="/szczegolyWizyta" element={<WizytySzczegolyClient/>} />
                    <Route path="/editWizyta" element={<WizytaEdytujClient/>} />
                    <Route path="/dodajWizyta" element={<WizytaDodajClient/>} />
                    <Route path="/samochody" element={<SamochodyClient/>} />
                    <Route path="/szczegolySamochod" element={<SamochodySzczegolyClient />} />
                    <Route path="/editSamochod" element={<SamochodEdytujClient/>} />
                    <Route path="/profile" element={<ProfileSzczegoly/>}/>
                    <Route path="/profile/edytuj" element={<ProfileEdit />} />


                    {/*<Route path="/admin/main" element={<MainAdmin/>} />*/}
                    <Route path="/admin/wizytyList" element={<WizytyListaAdmin />}/>
                    <Route path="/admin/wizytaSzczegoly" element={<WizytySzczegolyAdmin />}/>
                    <Route path="/admin/wizytaEdit" element={<WizytaEditAdmin/> } />
                    <Route path="/admin/wizytaDodaj" element={<WizytaDodajAdmin/>} />
                    <Route path="/admin/samochodyList" element={<SamochodyListaAdmin/>} />
                    <Route path="/admin/samochodSzczegoly" element={<SamochodSzczegolyAdmin/> }/>
                    <Route path="/admin/samochodEdit" element={<SamochodEditAdmin/>} />
                    <Route path="/admin/samochodDodaj" element={<SamochodDodajAdmin/>} />
                    <Route path="/admin/mechanicyList" element={<MechanicyListaAdmin/>} />
                    <Route path="/admin/mechanikSzczegoly" element={<MechanikSzczegolyAdmin/>} />
                    <Route path="admin/mechanikEdit" element={<MechanikEditAdmin/>} />
                    <Route path="admin/mechanikDodaj" element={<MechanikDodajAdmin/>} />




                    <Route path="/*" element={<NotFound/>}/>

                </Routes>
        </BrowserRouter>
    );
}

export default App;