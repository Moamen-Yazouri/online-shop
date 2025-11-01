import { User } from "generated/prisma";

export const serializeUsers = ((users: Omit<User, 'password'>[]) => {
    return users.map((user) => ({
        ...user,
        id: String(user.id)
    }));
});

export const serializeUser = ((user: Omit<User, 'password'>) => ({
    ...user,
    id: String(user.id)
}));