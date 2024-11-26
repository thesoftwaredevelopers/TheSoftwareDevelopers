'use client';

import { StudySession } from '@prisma/client';
import { Card, Button } from 'react-bootstrap';
import { updateSession } from '@/lib/dbActions';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/sessioncards.css';

type ExtendedStudySession = StudySession & {
  owner: {
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
};

const SessionCard = ({
  sessions,
  currentUser,
}: {
  sessions: ExtendedStudySession[];
  currentUser: number;
}) => {
  const addNewSession = async (studySession: ExtendedStudySession) => {
    await updateSession(studySession.id, currentUser);

    swal('Success', 'Session Added', 'success', {
      timer: 1500,
    });
  };
  return (
    <div className="sessionCard">
      {sessions.map((session) => (
        <div
          key={session.id} // **Add a unique key here**
          className="sessionCardBorder"
          style={{ backgroundColor: '#e6f3ff' }}
        >
          <Card className="sessionCardCont">
            <Card.Body className="px-4">
              <Card.Title className="text-primary text-start">
                {session.title}
              </Card.Title>
              <Card.Text className="text-secondary text-start mb-3 pt-3">
                {session.description}
              </Card.Text>

              <div className="session-details pt-1">
                <div className="detail-row pb-3">
                  <span className="detail-label">Organizer: </span>
                  <span className="detail-value">
                    {`${session.owner?.profile?.firstName} ${session.owner?.profile?.lastName}`}
                  </span>
                </div>
                <div className="detail-row pb-3">
                  <span className="detail-label">Date: </span>
                  <span className="detail-value">
                    {new Date(session.sessionDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="detail-row pb-3">
                  <span className="detail-label">Time: </span>
                  <span className="detail-value">
                    {new Date(session.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    -
                    {new Date(session.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="detail-row pb-3">
                  <span className="detail-label">Subject: </span>
                  <span className="detail-value">{session.course}</span>
                </div>
                <div className="detail-row pb-3">
                  <span className="detail-label">Location: </span>
                  <span className="detail-value">{session.location}</span>
                </div>
              </div>

              <Button
                className="requestBtn mt-3"
                onClick={() => addNewSession(session)}
              >
                Add Session
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};
export default SessionCard;
