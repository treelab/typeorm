import "reflect-metadata";
import { IgniteConnectionOptions } from "../../src/driver/ignite/IgniteConnectionOptions";
import { createConnection,MoreThan } from "../../src/index";
import { Post } from "./entity/Post";

const options: IgniteConnectionOptions = {
  type: "ignite",
  endpoint: "127.0.0.1:10800",
  schema: "test",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entity/*"],
};

const random = () => Math.round(Math.random() * 100);

createConnection(options).then(
  async (connection) => {
    let postRepository = connection.getRepository(Post);

    const post = new Post();
    // post.id = uuid.v4();
    post.text = "Hello how are you?";
    post.title = "hello";
    post.likesCount = random();

    const saved = await postRepository.save(post);
    console.log(saved);

    const posts = await postRepository.find();
    console.log("posts to be loaded: ", posts);

    const gt50 = await postRepository.find({ where: { likesCount: MoreThan(50) } });
    console.log("posts greater than 50: posts", gt50);

    const ordered = await postRepository.createQueryBuilder().orderBy("\"likesCount\"", "DESC").getMany();
    console.log("posts order by likedCount DESC: ", ordered);

    post.text = "Hello update";
    const {id, ...newPost} = post;
    const updated = await postRepository.update(id, newPost);
    console.log(updated);
  },
  (error) => console.log("Cannot connect: ", error.stack ? error.stack : error)
);
