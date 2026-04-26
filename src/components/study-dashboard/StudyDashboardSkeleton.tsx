import { Skeleton } from '../SkeletonScreen';

export const StudyDashboardSkeleton = () => (
  <div className="study-dashboard" aria-hidden="true">
    <div className="modal-hero study-dashboard__hero">
      <div className="study-dashboard__hero-copy">
        <Skeleton variant="title" width="38%" />
        <Skeleton variant="text" width="72%" />
      </div>
      <Skeleton variant="button" width="148px" height="40px" />
    </div>

    <div className="study-dashboard__metrics-grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="modal-card study-dashboard__metric-card study-dashboard__metric-card--skeleton">
          <Skeleton variant="icon-lg" />
          <Skeleton variant="text" width="56%" />
          <Skeleton variant="title" width="44%" />
          <Skeleton variant="text" width="68%" />
        </div>
      ))}
    </div>

    <div className="study-dashboard__content-grid">
      <div className="modal-card study-dashboard__panel">
        <div className="study-dashboard__panel-header">
          <Skeleton variant="title" width="34%" />
          <Skeleton variant="text" width="20%" />
        </div>
        <Skeleton className="study-dashboard__chart-skeleton" />
      </div>

      <div className="modal-card study-dashboard__panel">
        <div className="study-dashboard__panel-header">
          <Skeleton variant="title" width="48%" />
        </div>
        <div className="study-dashboard__progress-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="study-dashboard__progress-item">
              <div className="study-dashboard__progress-meta">
                <Skeleton variant="text" width="42%" />
                <Skeleton variant="text" width="18%" />
              </div>
              <Skeleton className="study-dashboard__progress-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StudyDashboardSkeleton;
