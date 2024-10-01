import { useState } from 'react'
import { State } from 'country-state-city'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import JobCard from '@/components/JobCard'
import JobListingSkeleton from '@/components/JobListingSkeleton'
import Navbar from '@/components/Navbar'
import { useFetchData } from '@/hooks/FetchJobs'
import { useFetchCompanies } from '@/hooks/FetchCompanies'

export default function Jobs() {
  const { loading, data, setFilter } = useFetchData()
  const { companies } = useFetchCompanies()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilter(value)
  }

  const handleStateChange = (value: string) => {
    setSelectedState(value)
    setFilter(value)
  }

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value)
    setFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedState('')
    setSelectedCompany('')
    setFilter('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 sm:text-4xl">Latest Jobs</h1>
        <section className="space-y-6 mb-12">
          <Input
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            placeholder="Search by title or location"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {State.getStatesOfCountry('IN').map((item: any) => (
                  <SelectItem key={item.isoCode} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCompany} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="destructive" className="w-full">
              Clear Filters
            </Button>
          </div>
        </section>
        {loading ? (
          <JobListingSkeleton />
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(({ id, description, location, title, companyId }) => (
              <JobCard
                key={id}
                id={id}
                companyId={companyId}
                description={description}
                location={location}
                title={title}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}