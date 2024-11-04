import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const user = await currentUser();
  const username = user?.firstName;
  const id = user?.id;
  console.log(username, id);

  const welcomeSuffix = username ? `, ${username} ${id}` : '';

  return (
    <div>
      Welcome {welcomeSuffix}
    </div>
  );
}
