import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { pick } from "lodash";
import {
  userAuthenticated,
  userHasPermission,
} from "../../../../../../auth/passport";
import { doesTrackGroupBelongToUser } from "../../../../../../utils/ownership";

const prisma = new PrismaClient();

type Params = {
  trackGroupId: string;
  userId: string;
};

export default function () {
  const operations = {
    PUT: [userAuthenticated, userHasPermission("owner"), PUT],
    DELETE: [userAuthenticated, userHasPermission("owner"), DELETE],
    GET,
  };

  async function GET(req: Request, res: Response, next: NextFunction) {
    const { userId, trackGroupId } = req.params as unknown as Params;

    try {
      const trackgroup = await doesTrackGroupBelongToUser(
        Number(trackGroupId),
        Number(userId)
      );

      if (!trackgroup) {
        res.status(400).json({
          error: "Trackgroup must belong to user",
        });
        return next();
      }

      res.status(200).json({ trackgroup });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  }

  async function PUT(req: Request, res: Response, next: NextFunction) {
    const { userId, trackGroupId } = req.params as unknown as Params;
    const data = req.body;
    const loggedInUser = req.user as User;
    try {
      const artist = await prisma.artist.findFirst({
        where: {
          userId: loggedInUser.id,
          id: Number(data.artistId),
        },
      });

      if (!artist) {
        res.status(400).json({
          error: "Artist must belong to user",
        });
        return next();
      }

      await prisma.trackGroup.updateMany({
        where: { id: Number(trackGroupId), artistId: artist.id },
        data: pick(data, [
          "title",
          "releaseDate",
          "published",
          "type",
          "about",
        ]),
      });

      res.json({ message: "Success" });
    } catch (error) {
      console.error("error", error);
      res.json({
        error: `TrackGroup with ID ${trackGroupId} does not exist in the database`,
      });
    }
  }

  PUT.apiDoc = {
    summary: "Updates a trackGroup belonging to a user",
    parameters: [
      {
        in: "path",
        name: "userId",
        required: true,
        type: "string",
      },
      {
        in: "path",
        name: "trackGroupId",
        required: true,
        type: "string",
      },
      {
        in: "body",
        name: "trackGroup",
        schema: {
          $ref: "#/definitions/TrackGroup",
        },
      },
    ],
    responses: {
      200: {
        description: "Updated trackgroup",
        schema: {
          $ref: "#/definitions/TrackGroup",
        },
      },
      default: {
        description: "An error occurred",
        schema: {
          additionalProperties: true,
        },
      },
    },
  };

  async function DELETE(req: Request, res: Response) {
    const { id } = req.params;
    // FIXME: ensure trackGroup is owned by user
    const post = await prisma.trackGroup.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(post);
  }

  DELETE.apiDoc = {
    summary: "Deletes a trackGroup belonging to a user",
    parameters: [
      {
        in: "path",
        name: "userId",
        required: true,
        type: "string",
      },
      {
        in: "path",
        name: "trackGroupId",
        required: true,
        type: "string",
      },
    ],
    responses: {
      200: {
        description: "Delete success",
      },
      default: {
        description: "An error occurred",
        schema: {
          additionalProperties: true,
        },
      },
    },
  };

  return operations;
}
