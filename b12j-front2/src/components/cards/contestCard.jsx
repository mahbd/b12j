import { Link } from "react-router-dom";
import { urls } from "../../configuration";
import { getTimeDifference, renderColX } from "../helperFunctions";
import { UserListSingleRow } from "../../apps/user/userList";
import { extractDate } from "../../apps/others/functions";
import dayjs from "dayjs";
import Countdown from "react-countdown";

const ContestCard = ({ contest, userActs, prev = false }) => {
  return (
    <div className={"card rounded-top"}>
      <div className={"card-header h4"}>
        <Link to={`${urls.contests}/${contest.id}`} className={"white-link"}>
          {contest.title}{" "}
        </Link>
      </div>

      <div className={"card-body"}>
        {renderColX([
          <div>
            <span className={"fw-bold"}>Writer(s)</span>
            <UserListSingleRow users={contest.writers} userActs={userActs} />
            <div className={"vertical-line"} />
          </div>,
          <div>
            <span className={"fw-bold"}>Tester(s)</span>
            <UserListSingleRow users={contest.testers} userActs={userActs} />
          </div>]
        )}

        {renderColX([
          <div>
            {!prev && <p>Starts {extractDate(contest.start_time)}</p>}
            {prev && <p>Ended {extractDate(contest.end_time)}</p>}
          <div className={"vertical-line"} />
          </div>,
          <div className="col">
            Length:
            {getTimeDifference(contest.end_time, contest.start_time)}
          </div>]
        )}

        <div className={"text-center"}>
          {dayjs().isSameOrBefore(contest.start_time) && (
            <div>
              <Countdown date={contest.start_time} className={"h2"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestCard