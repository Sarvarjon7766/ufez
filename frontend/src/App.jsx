import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./context/ProtectedRoute"

// 🏠 Asosiy sahifalar
import Home from "./pages/home/Home"
import LandArea from "./pages/landArea/LandArea"
import AllNews from "./pages/media/AllNews"
import Gallary from "./pages/media/Gallary"
import VideoGallary from "./pages/media/VideoGallary"
import Membership from "./pages/membership/Membership"
import NotFound from "./pages/notfound/NotFound"

// 👥 About sahifalari
import AboutLayout from "./pages/about/AboutLayout"
import AboutUs from "./pages/about/AboutUs"
import CharterEIZ from "./pages/about/CharterEIZ"
import EGovernment from "./pages/about/EGovernment"
import Employer from "./pages/about/Employer"
import InternationalRelations from "./pages/about/InternationalRelations"
import OrganizationStructure from "./pages/about/OrganizationStructure"
import PublicServices from "./pages/about/PublicServices"
import Rekvizit from "./pages/about/Rekvizit"
import Tasks from "./pages/about/Tasks"
import Team from "./pages/about/Team"

// 🏗️ Projects sahifalari
import Completed from "./pages/projects/Completed"
import Offer from "./pages/projects/Offer"
import Ongoing from "./pages/projects/Ongoing"
import ProjectsLayout from "./pages/projects/ProjectsLayout"

// 🔐 Admin sahifalari
import AdminHome from "./pages/admin/AdminHome"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminApplication from './pages/admin/pages/AdminApplication'
import AdminBanner from './pages/admin/pages/AdminBanner'
import AdminNews from './pages/admin/pages/AdminNews'
import AdminQuestion from './pages/admin/pages/AdminQuestion'
// <--- Urgut EIZ Direksiya --->
import AdminCharter from './pages/admin/pages/AdminCharter'
import AdminEgovernment from './pages/admin/pages/AdminEgovernment'
import AdminEmployer from './pages/admin/pages/AdminEmployer'
import AdminInternationalService from './pages/admin/pages/AdminInternationalService'
import AdminOrganizationStructure from './pages/admin/pages/AdminOrganizationStructure'
import AdminPublicService from './pages/admin/pages/AdminPublicService'
import AdminRekvizit from './pages/admin/pages/AdminRekvizit'
import AdminTask from './pages/admin/pages/AdminTask'
import AdminTeam from './pages/admin/pages/AdminTeam'
// <--- EIZ haqida --->
import AdminProjectCompleted from './pages/admin/pages/AdminProjectCompleted'
import AdminProjectOffer from './pages/admin/pages/AdminProjectOffer'
import AdminProjectOngoing from './pages/admin/pages/AdminProjectOngoing'

//<---- Yer maydoni --->
import AdminLandArea from './pages/admin/pages/AdminLandArea'
//<--- A'zolik--->
import AdminMembership from './pages/admin/pages/AdminMembership'


// 🔑 Auth
import Login from "./pages/auth/Login"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Asosiy sahifa */}
        <Route path="/" element={<Home />} />

        {/* 👥 About sahifalari */}
        <Route path="/about-us" element={<AboutLayout />}>
          <Route index element={<AboutUs />} />
          <Route path="team" element={<Team />} />
          <Route path="public-services" element={<PublicServices />} />
          <Route path="international" element={<InternationalRelations />} />
          <Route path="charter" element={<CharterEIZ />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="government" element={<EGovernment />} />
          <Route path="structure" element={<OrganizationStructure />} />
          <Route path="details" element={<Rekvizit />} />
          <Route path="employees" element={<Employer />} />
        </Route>

        {/* 🏗️ Projects sahifalari */}
        <Route path="/projects" element={<ProjectsLayout />}>
          <Route index element={<Completed />} />
          <Route path="completed" element={<Completed />} />
          <Route path="ongoing" element={<Ongoing />} />
          <Route path="offer" element={<Offer />} />
        </Route>

        {/* 🌍 Boshqa sahifalar */}
        <Route path="/landarea" element={<LandArea />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/allnews" element={<AllNews />} />
        <Route path="/gallary" element={<Gallary />} />
        <Route path="/video-gallary" element={<VideoGallary />} />

        {/* 🔑 Login sahifasi */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Admin yo‘nalishlari */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="banner" element={<AdminBanner />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="question" element={<AdminQuestion />} />
          <Route path="application" element={<AdminApplication />} />
          {/*EIZ Direksiyasi*/}
          <Route path="team" element={<AdminTeam />} />
          <Route path="public-service" element={<AdminPublicService />} />
          <Route path="internation-service" element={<AdminInternationalService />} />
          <Route path="charter" element={<AdminCharter />} />
          <Route path="task" element={<AdminTask />} />
          <Route path="e-government" element={<AdminEgovernment />} />
          <Route path="structure" element={<AdminOrganizationStructure />} />
          <Route path="rekvizit" element={<AdminRekvizit />} />
          <Route path="employer" element={<AdminEmployer />} />
          {/*EIZ haqida */}
          <Route path="completed" element={<AdminProjectCompleted />} />
          <Route path="ongoing" element={<AdminProjectOngoing />} />
          <Route path="offer" element={<AdminProjectOffer />} />
          {/*Yer maydoni */}
          <Route path="land-area" element={<AdminLandArea />} />
          {/*A'zolik */}
          <Route path="membership" element={<AdminMembership />} />
        </Route>

        {/* ❌ Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
