import { t } from "./initTRPC"
import { isStudent, isTeacher, isAdministrator, isAuthed } from "./users/shared/auth/middleware"

export const publicProcedure = t.procedure

export const studentProcedure = t.procedure.use(isStudent)

export const teacherProcedure = t.procedure.use(isTeacher)

export const administratorProcedure = t.procedure.use(isAdministrator)

export const authedProcedure = t.procedure.use(isAuthed)
