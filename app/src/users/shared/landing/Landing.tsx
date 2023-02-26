import { type FC, useState } from "react"
import RoleScreen from "./RoleScreen"
import StudentEmailScreen from "./StudentEmailScreen"
import AdministratorSchoolName from "./AdministratorSchoolName"
import AdministratorEmailScreen from "./AdministratorEmailScreen"
import useAuthStore from "../auth/useAuthStore"
import TeacherEmailScreen from "./TeacherEmailScreen"
import SchoolScreen from "./SchoolScreen"
import AdministratorTeacherEmailEndingScreen from "./AdministratorTeacherEmailEnding"
import AdministratorStudentEmailEndingScreen from "./AdministratorStudentEmailEndingScreen"
import NameScreen from "./NameScreen"
import { trpc } from "../lib/trpc"
import ProfilePhotoScreen from "./ProfilePhotoScreen"
import StudentTeacherScreen from "./StudentTeacherScreen"

export const routeIds = {
	role: "role",
	administratorEmail: "administratorEmail",
	adminSchoolName: "adminSchoolName",
	adminTeacherDomain: "adminTeacherDomain",
	adminStudentDomain: "adminStudentDomain",
	school: "school",
    studentEmail: "studentEmail",
    teacherEmail: "teacherEmail",
	studentTeacher: "studentTeacher",
	name: "name",
	profilePhoto: "profilePhoto",
}

export type RouteId = keyof typeof routeIds

const Landing: FC = () => {
	const [routeId, setRouteId] = useState<RouteId>("role")

	const [role, setRole] = useState<"student" | "teacher" | "administrator">()
	const [email, setEmail] = useState<string>()
    const [potentialSchools, setPotentialSchools] = useState<{
    id: number;
    name: string;
    city: string;
    state: string;
}[]>();
const [accountCreationToken, setAccountCreationToken] = useState<string>();
const [schoolId, setSchoolId] = useState<number>();
const [teacherEmailEnding, setTeacherEmailEnding] = useState<string>();
const [schoolCreationToken, setSchoolCreationToken] = useState<string>();
const [teacherEmail, setTeacherEmail] = useState<string>();
const [name, setName] = useState<string>();
const [accessToken, setAccessToken] = useState<string>();

const {setRole: setRoleStore, setAccessToken: setAccessTokenStore, completeLanding} = useAuthStore()

const complete = ({role, accessToken}: {accessToken: string, role: "student" | "teacher" | "administrator"}) => {
setRoleStore({role})
setAccessTokenStore(accessToken)
completeLanding()
}

	const CurrentScreen = {
		role: () => (
			<RoleScreen
				goToNextScreen={(role) => {
					setRole(role)
					;({
						administrator: () => setRouteId("adminSchoolName"),
						teacher: () => setRouteId("teacherEmail"),
						student: () => setRouteId("studentEmail"),
					})[role]()
				}}
			/>
		),
		studentEmail: () => (
			<StudentEmailScreen
				goToNextScreen={({email, potentialSchools, accountCreationToken}) => {
					setEmail(email)
                    setPotentialSchools(potentialSchools)
                    setAccountCreationToken(accountCreationToken)

						setRouteId("school")

				}}
			/>
		),
        teacherEmail: () => (
			<TeacherEmailScreen
				goToNextScreen={({email, potentialSchools, accountCreationToken}) => {


					setEmail(email)
                    setPotentialSchools(potentialSchools)
                    setAccountCreationToken(accountCreationToken)

						setRouteId("school")
				}}
			/>
		),
        administratorEmail: () => (
			<AdministratorEmailScreen
				goToNextScreen={(result) => {
                    if (result.schoolAlreadyCreated) {
                        complete({role: "administrator", accessToken: result.accessToken})
                    } else {
                        setSchoolCreationToken(result.schoolCreationToken)
                        setRouteId("adminTeacherDomain")
                    }
					
				}}
                schoolId={schoolId!}
			/>
		),
		adminSchoolName: () => <AdministratorSchoolName goToNextScreen={({schoolId}) => {
            setSchoolId(schoolId)    
            setRouteId("administratorEmail")}
        } />,
		adminTeacherDomain: () => <AdministratorTeacherEmailEndingScreen goToNextScreen={({teacherEmailEnding}) => {
            setTeacherEmailEnding(teacherEmailEnding)
            setRouteId("adminStudentDomain")
        } }/>,
		adminStudentDomain: () => <AdministratorStudentEmailEndingScreen schoolCreationToken={schoolCreationToken!} teacherEmailEnding={teacherEmailEnding!} goToNextScreen={(accessToken) => {
            complete({accessToken, role: "administrator"})
        }} />,
		school: () => <SchoolScreen potentialSchools={potentialSchools!} role={role as "teacher" | "student"} goToNextScreen={(schoolId) => {
            setSchoolId(schoolId)


            setRouteId(role === "teacher" ? "name" : "studentTeacher")
        }} />,
		studentTeacher: () => <StudentTeacherScreen accountCreationToken={accountCreationToken!}  schoolId={schoolId!} goToNextScreen={(teacherEmail) => {
			setTeacherEmail(teacherEmail)
			useAuthStore.setState({teacherEmail})
			setRouteId("name")
		}} />,
		name: () => <NameScreen accountCreationToken={accountCreationToken!} role={role as "teacher" | "student"} schoolId={schoolId!} teacherEmail={teacherEmail} goToNextScreen={({accessToken, name}) => {
            setAccessTokenStore(accessToken)
			setAccessToken(accessToken)
            setName(name)
            setRouteId("profilePhoto")
        }} />,
		profilePhoto: () => <ProfilePhotoScreen name={name!} goToNextScreen={() => {
            complete({accessToken: accessToken!, role: role!})
        }} />,
	}[routeId]

	return <CurrentScreen />
}

export default Landing
