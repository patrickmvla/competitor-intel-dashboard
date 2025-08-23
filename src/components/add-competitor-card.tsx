import { AddCompetitorForm } from "./add-competitor-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export function AddCompetitorCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Competitor</CardTitle>
        <CardDescription>
          Add a new website you want to start monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddCompetitorForm />
      </CardContent>
    </Card>
  );
}
