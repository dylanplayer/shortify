import { builder } from "./builder";

import "./types/User";
import "./types/Link";

export const schema = builder.toSchema()
