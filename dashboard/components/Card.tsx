export default function Card({
  children,
  title,
  addon,
}: {
  children: React.ReactNode
  title?: string
  addon?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded p-6 border space-y-5">
      <div className="flex items-center justify-between h-5">
        {title ? (
          <span className="font-semibold">
            {title}
          </span>
        ) : null}

        {addon ?? null}
      </div>
      {children}
    </div>
  )
}
