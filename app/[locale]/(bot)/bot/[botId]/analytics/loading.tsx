import { CardSkeleton } from '@/components/card-skeleton'
import { DashboardHeader } from '@/components/header'
import { DashboardShell } from '@/components/shell'
import { Card } from '@/components/ui/card'

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="Analyze your chatbot activity."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
