import axios from "axios";
import { type User } from "../types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(API_URL);
  return data;
};

export const fetchUser = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${API_URL}/${id}`);
  return data;
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { data } = await axios.post<User>(API_URL, user);
  return data;
};

export const updateUser = async (
  id: string,
  user: Omit<User, "id">
): Promise<User> => {
  const { data } = await axios.put<User>(`${API_URL}/${id}`, user);
  return data;
};
