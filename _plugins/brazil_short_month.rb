module DateFilter
  MONTHS = %w(Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez)

  def brazil_short_month(input)
    MONTHS[input.strftime("%m").to_i - 1]
  end
end

Liquid::Template.register_filter(DateFilter)
