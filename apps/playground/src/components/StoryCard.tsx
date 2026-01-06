interface StoryCardProps {
  id: number
  title: string
  category: string
  coverUrl: string
  onClick?: () => void
}

export default function StoryCard({ id, title, category, coverUrl, onClick }: StoryCardProps) {
  return (
    <div className="story-card" onClick={onClick} data-story-id={id}>
      <div className="story-card__cover">
        <img src={coverUrl} alt={title} loading="lazy" />
      </div>
      <div className="story-card__info">
        <h3 className="story-card__title">{title}</h3>
        <span className="story-card__category">{category}</span>
      </div>
    </div>
  )
}
